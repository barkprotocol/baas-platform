use anchor_lang::prelude::*;

declare_id!("AirDr0pPr0graM1DgoesHERE111111111111111");

#[program]
pub mod airdrop {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, airdrop_amount: u64) -> Result<()> {
        let airdrop = &mut ctx.accounts.airdrop;
        airdrop.authority = ctx.accounts.authority.key();
        airdrop.amount = airdrop_amount;
        airdrop.claimed = false;
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        let airdrop = &mut ctx.accounts.airdrop;
        if airdrop.claimed {
            return Err(ErrorCode::AlreadyClaimed.into());
        }
        
        let amount = airdrop.amount;
        **ctx.accounts.authority.try_borrow_mut_lamports()? -= amount;
        **ctx.accounts.recipient.try_borrow_mut_lamports()? += amount;

        airdrop.claimed = true;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 1)]
    pub airdrop: Account<'info, Airdrop>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut, has_one = authority)]
    pub airdrop: Account<'info, Airdrop>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(mut)]
    /// CHECK: This is the account that will receive the airdropped tokens
    pub recipient: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Airdrop {
    pub authority: Pubkey,
    pub amount: u64,
    pub claimed: bool,
}

#[error_code]
pub enum ErrorCode {
    #[msg("This airdrop has already been claimed")]
    AlreadyClaimed,
}